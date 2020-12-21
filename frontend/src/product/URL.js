import React, { useState } from "react";

import { Card } from "../layout/Card";
import { Submit } from '../forms/Submit';

export function URL({ onSubmit }) {
  const [url, setUrl] = useState("");
  
  return (
    <Card>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label className="form-label">
            Enter the URL to the product you want to buy
          </label>
          <div className="row">
            <div className="col col-10 col-md-11">
              <input
                type="url"
                className="form-control"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
            <div className="col col-2 col-md-1">
              <Submit onClick={onSubmit} />
            </div>
          </div>
        </div>
      </form>
    </Card>
  );
}
