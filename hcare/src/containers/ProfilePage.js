import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Card, Button, Spin } from "antd";
import dayjs from "dayjs";
import { fetchProfileStart, clearProfile } from "../features/profile/profileSlice";

export default function ProfilePage(){
  const dispatch=useDispatch();
  const user=useSelector(s=>s.auth.user);
  const profile=useSelector(s=>s.profile);

  useEffect(()=>{
    if(user?.id&&user?.role&&user?.email){
      dispatch(fetchProfileStart({id:user.id,role:user.role,email:user.email}));
    }
  },[user]);

  if(!user) return <p>Loading...</p>;

  const d=profile.data||{};
  const f=x=>x||"—";
  const fd=dob=>dob?dayjs(dob).format("DD MMM YYYY"):"—";

  return(<div style={{padding:20}}>
    <Card title="Profile">
      <h2>{d.name||user.name}</h2>
      <p>{d.email||user.email}</p>
      {profile.loading&&<Spin/>}
      <h3>Details</h3>
      <p><b>Phone:</b> {f(d.phone||d.contact)}</p>
      <p><b>Address:</b> {f(d.address)}</p>
      <p><b>DOB:</b> {fd(d.dob)}</p>
      <p><b>Gender:</b> {f(d.gender)}</p>
    </Card>
  </div>);
}
