import "./App.css";

function Topbar() {
  return (
    <div>
      <div className="topbar">
        <div className="logo">
          <img
            className="logophoto"
            src="./MicrosoftTeams-image (2).png"
            alt="img"
          ></img>
        </div>
        <div className="search">
          {/* <input className="inputbox" type="text"></input> */}
        </div>
        <div className="notification">
          <span class="material-symbols-outlined icon1">notifications</span>
        </div>
        <div className="gap"></div>
        <div className="profile">
          <img
            className="img"
            src="https://tranxify.s3.ap-south-1.amazonaws.com/profile.png"
            alt="img"
          ></img>
        </div>
      </div>
    </div>
  );
}

export default Topbar;
