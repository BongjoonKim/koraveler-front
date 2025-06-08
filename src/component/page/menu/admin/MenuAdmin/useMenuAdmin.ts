import {useCallback, useEffect, useState} from "react";
import {createMenus, deleteMenus, getAllMenus, updateMenus} from "../../../../../endpoints/menus-endpoints";
import {useRecoilState} from "recoil";
import recoil from "../../../../../stores/recoil";
import {initMenusDTO} from "../../../../../types/menus/initial";
import useAuthEP from "../../../../../utils/useAuthEP";

type ModalOpenProps = {
  type ?: "create" | "edit" | "delete" | null;
  isOpen ?: boolean;
  data ?: any;
}

function useMenuAdmin() {
  const [rowData, setRowData] = useState<any[]>([]);
  const [errorMsg, setErrorMsg] = useRecoilState(recoil.errMsg);
  const [modalOpen, setModalOpen] = useState<ModalOpenProps>({
    type : null,
    isOpen: false
  });
  const authEP = useAuthEP();
  const [menuData, setMenuData] = useState<MenusDTO>(initMenusDTO);
  
  
  const createModalOpen = useCallback(async() => {
    console.log("모달 클릭")
    setModalOpen({
      type : "create",
      isOpen: true,
      data : null
    });
    setMenuData(initMenusDTO);
  }, [modalOpen, menuData]);
  
  const saveMenu = useCallback(async() => {
    try {
      if(modalOpen.type === "create") {
        console.log("menuData", menuData)
        await createMenus(menuData);
      } else if (modalOpen.type === "edit") {
        await updateMenus(menuData);
      }
      setModalOpen({
        type: undefined,
        isOpen: false,
        data : null
      })
      await getMenus();
  
    } catch (e) {
      console.log("에러 확인", e)
    }
  }, [menuData, modalOpen]);
  
  const deleteMenu = useCallback(async () => {
    try {
      console.log("modalOpen.type ", modalOpen.type )
      if (modalOpen.type === "edit" && menuData.label) {
        await deleteMenus(menuData.label);
        setModalOpen({
          type: undefined,
          isOpen: false,
          data: null
        });
        await getMenus();
      }
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
      const res = await authEP({
        func: getAllMenus
      })
      setRowData(res.data);
    } catch (e) {
      setErrorMsg({
        status: "error",
        msg: "retrieve failed",
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
    saveMenu,
    deleteMenu,
  }
}

export default useMenuAdmin;