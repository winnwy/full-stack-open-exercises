import Part from "./Part";

const Content = ({ parts }) => {
  return (
    <>
      {parts.map((part) => (
        <Part key={crypto.randomUUID()} name={part.name} exercises={part.exercises} />
      ))}
    </>
  );
};

export default Content;
