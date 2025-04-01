const Total = ({ parts }) => {
  const totalCount = parts.reduce((acc, part) => acc + part.exercises, 0);
  return (
    <>
      <p>Number of exercises {totalCount}</p>
    </>
  );
};

export default Total;
