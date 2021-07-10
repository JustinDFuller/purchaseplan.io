import React, { useState, useEffect } from "react";
import ProgressBar from "react-bootstrap/ProgressBar";

import { Card } from "../layout/Card";
import * as form from "../form";

const messages = [
  "Trying to find the best image.",
  "Looking for the right price.",
  "Click on the pencil to edit your savings overview.",
  "Drag and drop purchases to rearrange them.",
];

export function URL({ onSubmit, loading, error }) {
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState(0);
  const [progress, setProgress] = useState(60);

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(url);
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
    <Card>
      {error && (
        <div className="alert alert-danger" role="alert">
          Please make sure the URL is correct and try again.
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-0">
          <label className="form-label">
            Enter the URL to the product you want to buy
          </label>
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
                <div className="col-12 col-lg-10">
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
                <div className="col-12 col-lg-2 text-right mt-3 mt-lg-0">
                  <form.components.Submit
                    onClick={handleSubmit}
                    loading={loading}
                    text="Search"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </form>
    </Card>
  );
}
