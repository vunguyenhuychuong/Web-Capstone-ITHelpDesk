const CountBox = ({ count }) => (
    <div
      style={{
        marginLeft: "1px", // Adjust the margin as needed
        backgroundColor: "#f2f2f2", // Background color of the count box
        borderRadius: "5px", // Border radius for rounded corners
      }}
    >
      {count}
    </div>
  );


export default CountBox;