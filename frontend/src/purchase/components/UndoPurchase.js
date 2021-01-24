import * as User from "../../user";

export const UndoPurchase = User.withContext(function ({
  closeToast,
  purchase,
  user,
  setUser,
}) {
  return (
    <div className="card-body">
      <h5 className="card-title">Purchased</h5>
      <p>{purchase.product().name()}</p>
      <button
        className="btn btn-primary mb-2"
        onClick={() => {
          const u = user.undoPurchase(purchase);
          setUser(u);
          User.api.put(u);
          closeToast();
        }}
      >
        Undo
      </button>
    </div>
  );
});
