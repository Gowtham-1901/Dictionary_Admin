import React from "react";
function Sidebar() {
  return (
    <main>
      <aside>
        <div className="sidebar">
          <a href="/reviewerDashboard" className={"icon"}>
            <span class="material-symbols-outlined google-icon">home</span>
            <h4 className="text">DASHBOARD</h4>
          </a>
          <a className={"icon"}>
            <span class="material-symbols-outlined">add_task</span>
            <h4 className="text">ASSIGN TASK</h4>
          </a>
          <a href="#" className={"icon"}>
            <span className="material-symbols-outlined google-icon">
              help_center
            </span>
            <h4 className="text">HELP</h4>
          </a>
          <a className={"icon"}>
            <span className="material-symbols-outlined google-icon">
              logout
            </span>
            <h4 className="text">LOGOUT</h4>
          </a>
        </div>
      </aside>
    </main>
  );
}

export default Sidebar;
