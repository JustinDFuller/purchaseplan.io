import React, { useState, useEffect } from "react";

import { Card } from "../layout/Card";
import { Submit } from "../forms/Submit";

const messages = [
  "Trying to find the best image",
  "Looking for the right price",
  "While you wait, why not update your savings overview?",
  "Are your purchases in the right order? Drag and drop them to rearrange.",
];

export function URL({ onSubmit, loading, error }) {
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState(-1);

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
            <div className="col-12 col-md-10">
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
            <div className="col-12 col-md-2 text-right mt-3 mt-md-0">
              <Submit onClick={handleSubmit} loading={loading} text="Search" />
            </div>
            {loading && <div className="col-12">{messages[message]}</div>}
          </div>
        </div>
      </form>
    </Card>
  );
}
