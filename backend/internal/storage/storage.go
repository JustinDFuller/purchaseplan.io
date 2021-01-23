package storage

import (
	"context"
	"crypto/md5"
	"encoding/hex"
	"fmt"
	"io"
	"net/http"
	"net/url"

	"cloud.google.com/go/storage"
)

// Client encapsulates operations on GCP cloud storage.
type Client struct {
	bucket  *storage.BucketHandle
	project string
}

// New creates a new storage client, scoped to the specified project.
func New(ctx context.Context, project string) (Client, error) {
	c := Client{
		project: project,
	}

	client, err := storage.NewClient(ctx)
	if err != nil {
		return c, err
	}

	bkt := client.Bucket("purchase-plan-images-local")
	c.bucket = bkt
	if _, err := bkt.Attrs(ctx); err == storage.ErrBucketNotExist {
		if err := bkt.Create(ctx, c.project, nil); err != nil {
			return c, err
		}
	}

	if err := bkt.ACL().Set(ctx, storage.AllUsers, storage.RoleReader); err != nil {
		return c, err
	}

	attrs, err := bkt.Attrs(ctx)
	if err != nil {
		return c, err
	}
	fmt.Println(attrs.Website)

	return c, nil
}

// PutImage will retrieve an image's contents and store it in the image bucket.
// It will store the name as an MD5 hash of the URL.
// The returned value is the hash of the URL.
func (c Client) PutImage(ctx context.Context, u string) (string, error) {
	h := md5.New()
	if _, err := io.WriteString(h, u); err != nil {
		return "", err
	}
	hash := hex.EncodeToString(h.Sum(nil))

	obj := c.bucket.Object(hash)
	w := obj.NewWriter(ctx)

	parsed, err := url.Parse(u)
	if err != nil {
		return "", err
	}
	parsed.Scheme = "https"

	res, err := http.Get(parsed.String())
	if err != nil {
		return "", err
	}
	defer res.Body.Close()

	if _, err := io.Copy(w, res.Body); err != nil {
		return "", err
	}

	if err := w.Close(); err != nil {
		return "", err
	}

	if err := obj.ACL().Set(ctx, storage.AllUsers, storage.RoleReader); err != nil {
		return "", err
	}

	attrs, err := obj.Attrs(ctx)
	if err != nil {
		return "", err
	}

	ml, err := url.Parse(attrs.MediaLink)
	if err != nil {
		return "", err
	}
	q := ml.Query()
	q.Del("generation")
	ml.RawQuery = q.Encode()

	return ml.String(), nil
}
