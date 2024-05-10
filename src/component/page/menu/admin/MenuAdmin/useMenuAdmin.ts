import {useCallback, useEffect, useState} from "react";
import {getAllMenus} from "../../../../../endpoints/menus-endpoints";
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
  
  const createModalOpen = () => {
    console.log("모달 클릭")
    setModalOpen({
      type : "create",
      isOpen: true,
      data : null
    })
  };
  
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
    setModalOpen
  }
}

export default useMenuAdmin;