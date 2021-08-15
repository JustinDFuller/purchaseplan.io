import * as User from "user";

export const UndoPurchase = User.data.WithContext(function ({
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
        onClick={async () => {
          closeToast();
          const u = user.undoPurchase(purchase);
          const res = await User.api.put(u);
          setUser(user.from(res));
        }}
      >
        Undo
      </button>
    </div>
  );
});
