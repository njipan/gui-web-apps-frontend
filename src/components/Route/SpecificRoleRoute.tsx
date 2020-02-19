import React from 'react';
import * as Auth from './../../shared/modules/auth';
import { Route } from 'react-router-dom';
import Swal from 'sweetalert2';
import Loader from '../Loader';

function A(){
  return (
    <h1>XXXXX</h1>
  )
}

export default function SpecificRoleRoute (props: any) {

    const getRedirectUrl = function(role: string){
      const urls: any = {
        student : '/gui',
        admin : '/admin'
      }
      return urls[role];
    }
    
    if(!Auth.check()){
      window.location.href = '/auth/login';
      return (<></>);
    }
  
    const allowedRole = props.role || 'admin';
    if(Auth.get().role !== allowedRole){
      window.location.href = getRedirectUrl(Auth.get().role);
      return (<></>);
    }

    Swal.fire({
        html: `
        <svg xmlns="http://www.w3.org/2000/svg" width="132" height="132"
        xmlns:link="http://www.w3.org/1999/xlink" style={ { margin: 'auto',display: 'block' } } viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
            <circle cx="50" cy="50" r="32" stroke-width="8" stroke="#3f51b5" stroke-dasharray="50.26548245743669 50.26548245743669" fill="none" stroke-linecap="round" transform="rotate(38.2442 50 50)">
            <animateTransform attributeName="transform" type="rotate" dur="1s" repeatCount="indefinite" keyTimes="0;1" values="0 50 50;360 50 50"></animateTransform>
            </circle>
            <circle cx="50" cy="50" r="23" stroke-width="8" stroke="#a7d4ec" stroke-dasharray="36.12831551628262 36.12831551628262" stroke-dashoffset="36.12831551628262" fill="none" stroke-linecap="round" transform="rotate(-38.2442 50 50)">
            <animateTransform attributeName="transform" type="rotate" dur="1s" repeatCount="indefinite" keyTimes="0;1" values="0 50 50;-360 50 50"></animateTransform>
            </circle>
        </svg>
        `,
        showConfirmButton: false
    });
  
    return (
      <>
        <Route { ...props }/>
      </>
    )
  }