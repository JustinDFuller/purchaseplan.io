import * as Tracking from "tracking";

export function Download() {
  return (
    <div className="row py-3">
      <div className="col col-12 text-center">
        <a
          href="https://play.google.com/store/apps/details?id=com.purchaseplan.android&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1"
          target="_blank"
          rel="noreferrer"
          onClick={() =>
            Tracking.api.action({ Name: "Google Play" })
          }
        >
          <img
            alt="Get it on Google Play"
            src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
            height={80}
          />
        </a>
      </div>
    </div>
  );
}
