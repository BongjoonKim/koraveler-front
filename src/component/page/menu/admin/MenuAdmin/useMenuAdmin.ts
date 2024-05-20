import {useCallback, useEffect, useState} from "react";
import {createMenus, getAllMenus, updateMenus} from "../../../../../endpoints/menus-endpoints";
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
    types : ["admin"]
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
    try {
      if(modalOpen.type === "create") {
        console.log("menuData", menuData)
        await createMenus(menuData);
      } else if (modalOpen.type === "edit") {
        await updateMenus(menuData);
      }
      await getMenus();

    } catch (e) {
      console.log("에러 확인", e)
    }
  }, [menuData, modalOpen]);
  
  const editModalOpen = useCallback(() => {
    setModalOpen({
      type : "edit",
      isOpen: true,
      data : null
    });
    
  }, [modalOpen]);
  
  const modalClose = useCallback(() => {
    setModalOpen({
        type : undefined,
        isOpen: false,
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
    modalClose,
    modalOpen,
    setModalOpen,
    menuData,
    setMenuData,
    createMenu,
  }
}

export default useMenuAdmin;