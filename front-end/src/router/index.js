import { Routes, Route } from "react-router-dom";
import AdminCommands from "../pages/panelAdmin/command/index";
import AdminLogin from "../pages/panelAdmin/adminAuth/adminLogin"
import AdminRegister from "../pages/panelAdmin/adminAuth/adminRegister"
import Home from "../pages/panelAdmin/Home/home"
import Profile from "../pages/panelAdmin/adminAuth/profile"

import Clients from "../pages/panelAdmin/client/index";
import ClientStore from "../pages/panelAdmin/client/store";
import ClientUpdate from "../pages/panelAdmin/client/update";

import CommandesStore from "../pages/panelAdmin/command/store";
import CommandesUpdate from "../pages/panelAdmin/command/update"
import Fournisseurs from "../pages/panelAdmin/fournisseurs/index";
import FournisseurStore from "../pages/panelAdmin/fournisseurs/store";
import FournisseurUpdate from "../pages/panelAdmin/fournisseurs/update";

import TypeVerre from "../pages/panelAdmin/typeVerre/index";
import TypeVerreStore from "../pages/panelAdmin/typeVerre/store";
import TypeVerreUpdate from "../pages/panelAdmin/typeVerre/update";
import Stats from "../pages/panelAdmin/stats/stats";


function Myrouter() {
   return (
      <Routes>

         <Route path="/admin/AdminHome" element={<Home />} />
         <Route path="/admin/profile" element={<Profile />} />


         <Route path="/admin/client" element={<Clients />} />
         <Route path="/admin/clientStore" element={<ClientStore />} />
         <Route path="/admin/clientUpdate" element={<ClientUpdate />} />

         <Route path="/admin/CommandStore" element={<CommandesStore />} />
         <Route path="/admin/CommandUpdate/:id" element={<CommandesUpdate />} />
         <Route path="/admin/commands" element={<AdminCommands />} />

         <Route path="/admin/fournisseurs" element={<Fournisseurs />} />
         <Route path="/admin/fournisseurStore" element={<FournisseurStore />} />
         <Route path="/admin/fournisseurUpdate" element={<FournisseurUpdate />} />

         <Route path="/admin/typeVerre" element={<TypeVerre />} />
         <Route path="/admin/typeVerreStore" element={<TypeVerreStore />} />
         <Route path="/admin/typeVerreUpdate" element={<TypeVerreUpdate />} />

         <Route path="/" element={<AdminRegister />} />
         <Route path="/Login" element={<AdminLogin />} />

         <Route path="/admin/stats" element={<Stats />} />
      </Routes>
   )
}

export default Myrouter;