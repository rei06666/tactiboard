import addIcon from "../../img/add.png";
import { useNavigate } from "react-router-dom";

type Props = {};

const AddTacticsButton = (props: Props) => {
  const navigate = useNavigate();
  return (
    <button
      className="btn btn-primary  p-1 min-h-0 h-6 ml-2 justify-center items-center"
      onClick={() => navigate("/tactics/create")}
    >
      <img src={addIcon} className="h-2/3" alt="add icon" />
      Add tactics
    </button>
  );
};

export default AddTacticsButton;
