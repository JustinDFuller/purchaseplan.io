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

export function URL({ onNoURL, onSubmit, loading, error }) {
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
    <layout.components.Card bodyClassName="pb-1">
      {error && (
        <div className="alert alert-danger" role="alert">
          Please make sure the URL is correct and try again.
        </div>
      )}
      <form onSubmit={handleSubmit}>
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
                    className="form-control"
                    value={url}
                    disabled={loading}
                    placeholder="https://smile.amazon.com/cool-new-fitbit"
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </div>
                <div className="col-12 col-lg-3 text-right mt-3 mt-lg-0">
                  <form.components.Submit
                    onClick={handleSubmit}
                    loading={loading}
                    text="Import"
                  />
                </div>
              </>
            )}
            <div className="col-12">
              <button
                className="btn btn-link white px-0 my-3 d-lg-none d-block w-100"
                style={styles.combine(styles.text, {
                  border: "1px solid white",
                })}
                type="button"
                onClick={handleNoURL}
              >
                I don't have a link.
              </button>
              <button
                className="btn btn-link white px-0 mt-1 d-lg-block d-none"
                style={styles.text}
                type="button"
                onClick={handleNoURL}
              >
                I don't have a link.
              </button>
            </div>
          </div>
        </div>
      </form>
    </layout.components.Card>
  );
}
