import * as User from "user";
import * as Tracking from "tracking";

export const UndoPurchase = User.data.WithContext(function ({
  closeToast,
  purchase,
  user,
  setUser,
}) {
  return (
    <div className="card-body">
      <h5 className="card-title">Purchased</h5>
      <p className="line-clamp-2">{purchase.product().name()}</p>
      <button
        className="btn btn-primary mb-2"
        onClick={async () => {
          closeToast();
          const u = user.undoPurchase(purchase);
          const res = await User.api.put(u);
          setUser(user.from(res));
          Tracking.api.action({ Type: "action", Name: "Click Undo Purchase" });
        }}
      >
        Undo
      </button>
    </div>
  );
});
