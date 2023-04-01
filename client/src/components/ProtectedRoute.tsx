import {Navigate} from "react-router-dom"
import {useDispatch, useSelector} from "react-redux";
import {IRootState} from "../interfaces/interfaces";

export default function ProtectedRoute({children}: any) {
  
  const {id} = useSelector((state: IRootState) => state.user.user)
  
  return (
    id ? children : <Navigate to="/signin" />
  );
}