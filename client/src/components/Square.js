const Square = ({ value, numSquare, onSquareClick }) => {
  const defineClassName = (num) => {
    let nameClass = "square";
    if (num === 0 || num === 1 || num === 3 || num === 4) {
      nameClass = "square borderRightBottom";
    } else if (num === 2 || num === 5) {
      nameClass = "square borderBottom";
    } else if (num === 6 || num === 7) {
      nameClass = "square borderRight";
    } else {
      nameClass = "square";
    }
    return nameClass;
  };

  return (
    <div className={defineClassName(numSquare)}>
      <button onClick={onSquareClick}>{value}</button>
    </div>
  );
};

export default Square;
