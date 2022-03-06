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
      <p className="line-clamp-2">{purchase.product().name()}</p>
      <button
        className="btn btn-primary mb-2"
        onClick={async () => {
          closeToast();
          const purchases = user.purchases().undoRemove(purchase);
          const u = user.setPurchases(purchases);
          const res = await User.api.put(u);
          setUser(user.from(res));
        }}
      >
        Undo
      </button>
    </div>
  );
});
