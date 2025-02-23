import React, { useState, useEffect } from "react";
import {
  Button
} from "@material-ui/core";
import axios from 'axios';
import {
  useHistory,
  useParams,
} from "react-router-dom";

// components
import PageTitle from "../../../components/PageTitle/PageTitle";
import useStyles from "./styles";

const url = `https://backend.omcloud.vn/api/user/`;

export default function EditUser () {
  var classes = useStyles();
  let history  = useHistory();

  const paramId = useParams();
  const currentUserId = paramId.id;

  const [ roles, setRoles ] = useState([]);
  const [ roleID, setRoleID ] = useState('');

  const [ name, setName ] = useState('');
  const [ username, setUsername ] = useState('');
  const [ email, setEmail ] = useState('');
  const [ tel, setTel ] = useState('');

  useEffect(() => {
    loadUser();
    loadRoles();
  }, []);

  const loadUser = async () => {
    const result = await axios.get(url + currentUserId);
    setName(result.data.data.name);
    setUsername(result.data.data.username);
    setEmail(result.data.data.email);
    setTel(result.data.data.tel);
    setRoleID(result.data.data.role_id);
  };

  const loadRoles = async () => {
    const result = await axios.get('https://backend.omcloud.vn/api/role');
    setRoles(result.data.data);
  };

  const Role = roles.map(Role => Role)

  const handleRolesChange = (e) => {
    setRoleID(e.target.value);
  }

  const handleEditUser = (e) => {
    e.preventDefault();
    if (name === "") {
      alert("Vui lòng nhập họ tên");
      return;
    }

    if (username === "") {
      alert("Vui lòng nhập username");
      return;
    }

    if (email === "") {
      alert("Vui lòng nhập email");
      return;
    }

    if (tel === "") {
      alert("Vui lòng nhập số điện thoại");
      return;
    }

    const newUser = {
      name: name,
      username: username,
      email: email,
      tel: tel,
      role_id: roleID
    }

    axios.put('https://backend.omcloud.vn/api/user/' + currentUserId, newUser)
    .then(res => {
      alert('Cập nhật tài khoản thành công!');
      history.push('/app/users');
    })
    .catch(error => console.log(error));
  }

  return (
    <>
      <PageTitle title="Cập nhật tài khoản" />
      <div className={classes.newUserForm}>
        <div className={classes.newUserItem}>
            <label className={classes.label}>Họ tên</label>
            <input type="text" name="name" className={classes.inputName} value={name} onChange={(e) => setName(e.target.value)} placeholder='Nhập họ tên...' />
        </div>
        <div className={classes.newUserItem}>
            <label className={classes.label}>Username</label>
            <input type="text" name="username" className={classes.inputName} value={username} onChange={(e) => setUsername(e.target.value)} placeholder='Nhập username...' />
        </div>
        <div className={classes.newUserItem}>
            <label className={classes.label}>Email</label>
            <input type="email" name="email" className={classes.inputName} value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Nhập email...' />
        </div>
        <div className={classes.newUserItem}>
            <label className={classes.label}>Điện thoại</label>
            <input type="tel" name="tel" className={classes.inputName} value={tel} onChange={(e) => setTel(e.target.value)} placeholder='Nhập số điện thoại...' />
        </div>
        <div className={classes.newUserItem}>
          <label className={classes.label}>Nhóm</label>
          <select
            onChange={e => handleRolesChange(e)}
            className={classes.newUserType}
            id="newUserType"
            value={roleID}
          >
            <option>-----</option>
            {
                Role.map((value, key) => <option key={value.id} value={value.id}>{value.title}</option>)
            }
          </select>
        </div>
        <Button
          variant="contained"
          size="medium"
          color="secondary"
          className={classes.newUserBtn}
          onClick={handleEditUser}
        >
          Cập nhật
        </Button>
      </div>
    </>
  );
}
