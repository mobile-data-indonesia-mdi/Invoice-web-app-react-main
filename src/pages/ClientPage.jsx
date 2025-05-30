import {useEffect, useState} from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";


import Sidebar from "@/components/ui/Sidebar.jsx";
import ContentHeader from "@/components/ui/content-header/ContentHeader";
import ClientForm from "@/components/client/ClientForm";
import ClientTable from "@/components/client/ClientTable";

import {fetchAllClients} from "@/redux/clientSlice.js";

export default function ClientPage() {
  const location = useLocation();
  const dispatch = useDispatch();

  const [selectedMenu, setSelectedMenu] = useState("clients");
  const [showModal, setShowModal] = useState({type: "create", status: false });

  // Fetching clients data
  const clients = useSelector((state) => state.clients.allClients);
  const loading = useSelector((state) => state.clients.loading);
  const error = useSelector((state) => state.clients.error);

  useEffect(() => {
    // Fetch all clients when the component mounts
    dispatch(fetchAllClients());
  }, [dispatch]);
    return (
        <div className="flex bg-[#f8f8fb] dark:bg-[#141625] min-h-screen">
            <Sidebar selectedMenu={selectedMenu} onMenuSelect={setSelectedMenu} />

            {/* Center */}
            <div className="w-full px-2 py-10 md:py-16 lg:py-28 scrollbar-hide duration-300 ml-0 md:ml-48">
                <motion.div
                    key={location.pathname}
                    initial={{ x: "0" }}
                    animate={{ x: 0 }}
                    exit={{ x: "-150%" }}
                    transition={{ duration: 0.5 }}
                    className="max-w-full md:max-w-3xl lg:max-w-6xl mx-auto"
                >
                    <ContentHeader
                        selectedMenu={selectedMenu}
                        items={clients}
                        onOpenCreateMenu={setShowModal}
                    />

                    {console.log("Clients di ClientPage:", clients)}
                    {loading ? (
                        <p className="text-center text-gray-500 dark:text-gray-400">
                            Loading clients...
                        </p>
                    ) : error ? (
                        <p className="text-center text-red-500">Error fetching clients</p>
                    ) : clients === null || clients.length  <= 0 ? (
                        <p className="text-center text-gray-500 dark:text-gray-400">
                            No clients found.
                        </p>
                    ) : (
                        <ClientTable
                            setShowModal={setShowModal}
                        />
                    )}
                </motion.div>
            </div>
            {/* End Center */}

            {/* Modal */}
            <AnimatePresence>
                {showModal.status === true && (
                    <ClientForm
                        showModal={showModal}
                        setShowModal={setShowModal}
                    />
                )}
            </AnimatePresence>
        </div>
    );

}
