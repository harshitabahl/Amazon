import "./widgetSm.css";
import { Visibility } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { userRequest } from "../../requestMethods";

export default function WidgetSm() {
  const [users, setUsers] = useState([]);

  useEffect(() => {

    const getUsers = async () => {
      try {
        const res = await userRequest.get("users/?new=true");
        setUsers(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    getUsers();

  }, []);

  return (
    <div className="widgetSm">
      <span className="widgetSmTitle">New Join Members</span>
      <ul className="widgetSmList">

        {users.map((user) => (
          <li className="widgetSmListItem" key={user._id}>

            <img
              src={
                user.img ||
                "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg"
              }
              alt=""
              className="widgetSmImg"
            />

            <div className="widgetSmUser">
              <span className="widgetSmUsername">
                {user.username}
              </span>

              <span className="widgetSmUserTitle">
                {user.email}
              </span>
            </div>

            <button className="widgetSmButton">
              <Visibility className="widgetSmIcon" />
              Display
            </button>

          </li>
        ))}

      </ul>
    </div>
  );
}