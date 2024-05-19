import {useCallback, useEffect, useState} from "react";
import {createMenus, getAllMenus} from "../../../../../endpoints/menus-endpoints";
import {useRecoilState} from "recoil";
import recoil from "../../../../../stores/recoil";

type ModalOpenProps = {
  type ?: "create" | "edit" | "delete" | null;
  isOpen ?: boolean;
  data ?: any;
}

function useMenuAdmin() {
  const [rowData, setRowData] = useState<any[]>([]);
  const [errorMsg, setErrorMsg] = useRecoilState(recoil.alertMsg);
  const [modalOpen, setModalOpen] = useState<ModalOpenProps>({
    type : null,
    isOpen: false
  });
  const [menuData, setMenuData] = useState<MenusDTO>({
    label : "",
    value : '',
    sequence : 0,
    url : "",
    types : []
  });
  
  const createModalOpen = useCallback(async() => {
    console.log("모달 클릭")
    setModalOpen({
      type : "create",
      isOpen: true,
      data : null
    });
    
  }, []);
  
  const createMenu = useCallback(async() => {
    console.log("menuData", menuData)
    await createMenus(menuData);
  }, [menuData]);
  
  const editModalOpen = useCallback(() => {
    setModalOpen({
      type : "edit",
      isOpen: true,
      data : null
    })
  }, [modalOpen])
  
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
    rowData,
    createModalOpen,
    editModalOpen,
    modalOpen,
    setModalOpen,
    menuData,
    setMenuData,
    createMenu,
  }
}

export default useMenuAdmin;