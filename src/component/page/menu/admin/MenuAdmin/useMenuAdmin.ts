import {useCallback, useEffect, useState} from "react";
import {getAllMenus} from "../../../../../endpoints/menus-endpoints";
import {useRecoilState} from "recoil";
import recoil from "../../../../../stores/recoil";

function useMenuAdmin() {
  const [rowData, setRowData] = useState<any[]>([]);
  const [errorMsg, setErrorMsg] = useRecoilState(recoil.alertMsg);
  
  
  const getMenus = useCallback(async () => {
    try {
      const res = await getAllMenus();
      setRowData(res.data);
    } catch (e) {
      setErrorMsg({
        status: "error",
        title: "retrieve failed",
        description: "retrieve menus failed",
      })
    }
  }, [rowData]);
  
  useEffect(() => {
    getMenus();
  }, []);
  
  return {
    rowData
  }
}

export default useMenuAdmin;