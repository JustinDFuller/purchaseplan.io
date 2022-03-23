import React, { useState, useEffect } from "react";
import ProgressBar from "react-bootstrap/ProgressBar";

import * as layout from "layout";
import * as form from "form";
import * as styles from "styles";

const messages = [
  "Trying to find the best image.",
  "Looking for the right price.",
  "Click on the pencil to edit your savings overview.",
  "Drag and drop purchases to rearrange them.",
];

export function URL({ onNoURL, onSubmit, loading, error, disabled }) {
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState(0);
  const [progress, setProgress] = useState(60);

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(url);
  }

  function handleNoURL(e) {
    e.preventDefault();
    onNoURL();
  }

  useEffect(
    function () {
      if (loading) {
        const i = setInterval(function () {
          if (message < messages.length - 1) {
            setMessage((m) => m + 1);
            setProgress((p) => p + 12);
          } else {
            clearInterval(i);
          }
        }, 3000);
        return function () {
          clearInterval(i);
        };
      }
    },
    [loading, message]
  );

  return (
    <layout.components.Card bodyClassName="pb-1" style={{ width: "100%" }}>
      {error && (
        <div className="alert alert-danger" role="alert">
          Please make sure the URL is correct and try again.
        </div>
      )}
      <form onSubmit={handleSubmit} disabled={disabled}>
        <div className="form-group mb-0">
          <h5 className="card-title">What do you want to buy?</h5>
          <div className="row">
            {loading ? (
              <div className="col-12">
                <ProgressBar
                  variant="primary"
                  now={progress}
                  label={messages[message]}
                  style={{ height: "calc(1.5em + 0.75rem + 2px)" }}
                />
              </div>
            ) : (
              <>
                <div className="col-12 col-lg-9">
                  <input
                    required
                    type="url"
                    className="form-control loader"
                    value={url}
                    disabled={loading || disabled}
                    placeholder="Paste a link here"
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </div>
                <div className="col-12 col-lg-3 text-right mt-3 mt-lg-0">
                  <form.components.Submit
                    onClick={handleSubmit}
                    loading={loading}
                    text="Import"
                    className="loader"
                    disabled={loading || disabled}
                  />
                  <button
                    className="btn btn-link white px-0 mt-1 d-lg-block d-none m-auto loader"
                    style={{ color: styles.theme.cardTextColor }}
                    type="button"
                    onClick={handleNoURL}
                    disabled={loading || disabled}
                  >
                    I don't have a link
                  </button>
                </div>
              </>
            )}
            <div className="col-12">
              <button
                className="btn btn-link white px-0 my-3 d-lg-none d-block w-100 loader"
                style={styles.combine(styles.text, {
                  color: styles.theme.cardTextColor,
                  border: "1px solid white",
                })}
                type="button"
                onClick={handleNoURL}
                disabled={loading || disabled}
              >
                I don't have a link
              </button>
            </div>
          </div>
        </div>
      </form>
    </layout.components.Card>
  );
}
