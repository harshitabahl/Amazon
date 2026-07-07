function SkeletonCard() {
  return (
    <div
      className="skeleton-card"
      aria-hidden="true"
    >
      <div className="skeleton-img"></div>

      <div className="skeleton-line"></div>

      <div
        className="skeleton-line"
        style={{ width: "70%" }}
      ></div>

      <div
        className="skeleton-line"
        style={{ width: "45%" }}
      ></div>

      <div
        className="skeleton-line"
        style={{
          width: "60%",
          marginTop: "18px",
        }}
      ></div>
    </div>
  );
}

export default SkeletonCard;