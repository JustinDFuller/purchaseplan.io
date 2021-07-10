import * as User from "user";

export const UndoRemove = User.data.WithContext(function ({
  closeToast,
  purchase,
  user,
  setUser,
}) {
  return (
    <div className="card-body">
      <h5 className="card-title">Removed</h5>
      <p>{purchase.product().name()}</p>
      <button
        className="btn btn-primary mb-2"
        onClick={() => {
          const purchases = user.purchases().undoRemove(purchase);
          const u = user.setPurchases(purchases);
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
