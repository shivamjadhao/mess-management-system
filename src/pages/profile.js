import axios from "axios";
import React, { useEffect, useState } from "react";
import Lists from "../components/Lists";
import { base_url } from "../constants";
import { useSearchParams } from "react-router-dom";

const Profile = () => {
    const [post, setPost] = React.useState(null);
    let [searchParams, setSearchParams] = useSearchParams();

    const rno = searchParams.get("rno");
    var data = 'lorem <b>ipsum</b>';
    axios.get(base_url + `/show_user?rno=${rno}`).then((response) => {
        setPost(response.data);
      });
    console.log(post)
    return (
    <div
        dangerouslySetInnerHTML={{__html: post}}
    />
    );      
      
  }
  
export default Profile;