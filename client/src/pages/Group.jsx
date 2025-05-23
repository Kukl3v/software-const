import React, { useContext, useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaUserPlus } from 'react-icons/fa';
import ContentBlock from '../components/ContentBlock';
import PageTitle from '../components/PageTitle';
import Modal from '../components/Modal';
import { AuthContext } from '../AuthContext';
import Pagination from '../components/Pagination';
import { toast } from 'sonner';
import {
  getClassesByUserRequest,
  getClassesByTrainerRequest,
  getClassesByClubRequest,
  createGroupRequest,
  removeGroupRequest,
  addClientsToGroupRequest
} from '../services/groupService';
import { getAllClubsRequest } from '../services/clubService';
import {  
  getUserByEmailRequest,
  getUsersByRoleRequest } from '../services/accountService';

export default function Group({ title, clubId: defaultClubId }) {
  PageTitle(title);
  const { role, user: userEmail } = useContext(AuthContext);

  const [userId, setUserId] = useState(null);
  const [groups, setGroups] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [modalType, setModalType] = useState(null);
  const [currentGroup, setCurrentGroup] = useState(null);

  const [clients, setClients] = useState([]);
  const [selectedClients, setSelectedClients] = useState(new Set());

  const [clubs, setClubs] = useState([]);
  const [selectedClub, setSelectedClub] = useState(defaultClubId);

  const size = 12;

  // Получение реального userId по email
  useEffect(() => {
    if (!userEmail) return;
    getUserByEmailRequest(userEmail)
      .then((user) => setUserId(user.id))
      .catch(() => toast.error('Не удалось получить информацию о пользователе'));
  }, [userEmail]);

  // Загрузка списка клубов для селекта
  useEffect(() => {
    getAllClubsRequest()
      .then((data) => setClubs(data))
      .catch(() => toast.error('Не удалось загрузить список клубов'));
  }, []);

  const loadGroups = async () => {
    try {
      let data = [];
      if (role === 'USER' && userId) data = await getClassesByUserRequest(userId);
      else if (role === 'EMPLOYEE' && userId) data = await getClassesByTrainerRequest(userId);
      else data = await getClassesByClubRequest(defaultClubId);
      setGroups(data);
      setTotalPages(Math.ceil(data.length / size));
      console.log(data)
    } catch {
      toast.error('Ошибка загрузки групп');
    }
  };

  useEffect(() => {
    if ((role === 'USER' || role === 'EMPLOYEE') && !userId) return;
    loadGroups();
  }, [page, userId, role, defaultClubId]);

  const openModal = async (type, group = null) => {
    setModalType(type);
    setCurrentGroup(group);
    setSelectedClub(defaultClubId);

    try {
      const users = await getUsersByRoleRequest('USER');
      setClients(users);
      setSelectedClients(new Set(group?.clientIds || []));
    } catch {
      toast.error('Не удалось загрузить список клиентов');
    }
  };

  const closeModal = () => {
    setModalType(null);
    setCurrentGroup(null);
    setSelectedClients(new Set());
    setSelectedClub(defaultClubId);
  };

  const toggleClient = (id) => {
    setSelectedClients((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleCreate = async () => {
    try {
      await createGroupRequest(selectedClub, {
        trainerId: userId,
        clientIds: Array.from(selectedClients),
      });
      toast.success('Группа создана');
      closeModal();
      loadGroups();
    } catch {
      toast.error('Не удалось создать группу');
    }
  };

  const handleRemove = async () => {
    try {
      await removeGroupRequest(currentGroup.id, defaultClubId);
      toast.success('Группа удалена');
      closeModal();
      loadGroups();
    } catch {
      toast.error('Не удалось удалить группу');
    }
  };

  const handleAddClients = async () => {
    try {
      await addClientsToGroupRequest(currentGroup.id, Array.from(selectedClients));
      toast.success('Клиенты добавлены');
      closeModal();
      loadGroups();
    } catch {
      toast.error('Ошибка добавления клиентов');
    }
  };

  return (
    <ContentBlock
      valueBlock={
        <>
          {(role === 'EMPLOYEE' || role === 'ADMIN') && (
            <div className="flex w-full mb-5">
              <button
                onClick={() => openModal('create')}
                className="py-3 px-4 inline-flex items-center gap-x-2 border border-gray-800 rounded-lg hover:bg-gray-100"
              >
                <FaPlus /> Создать группу
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {groups.map((g) => (
              <div key={g.id} className="bg-white p-4 rounded-xl shadow relative">
                <h3 className="font-bold">Группа {g.id}</h3>
                <p className="text-sm">Тренер: {g.trainerId}</p>
                <p className="text-sm">Клиентов: {g.clientIds?.length || 0}</p>
                {(role === 'EMPLOYEE' || role === 'ADMIN') && (
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button onClick={() => openModal('addClients', g)}>
                      <FaUserPlus />
                    </button>
                    <button onClick={() => openModal('delete', g)}>
                      <FaTrash />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />

          <Modal open={!!modalType} onClose={closeModal}>
            {modalType === 'create' && (
              <div>
                <h3 className="mb-4 font-bold text-center">Создать новую группу</h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Клуб</label>
                  <select
                    value={selectedClub}
                    onChange={(e) => setSelectedClub(e.target.value)}
                    className="w-full py-2 px-3 border border-gray-200 rounded-lg mb-4"
                  >
                    {clubs.map((club) => (
                      <option key={club.id} value={club.id}>
                        {club.city} {club.address}
                      </option>
                    ))}
                  </select>
                  <label className="block text-sm font-medium mb-1">Клиенты</label>
                  <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-2">
                    {clients.map((c) => (
                      <label key={c.id} className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          checked={selectedClients.has(c.id)}
                          onChange={() => toggleClient(c.id)}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">{`${c.firstName} ${c.lastName}`}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 mt-6">
                  <button
                    onClick={closeModal}
                    className="flex-1 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    Отмена
                  </button>
                  <button
                    onClick={handleCreate}
                    className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Создать
                  </button>
                </div>
              </div>
            )}

            {modalType === 'delete' && (
              <div className="text-center">
                <h3 className="mb-4">Удалить группу?</h3>
                <div className="flex gap-2 mt-6">
                  <button
                    onClick={closeModal}
                    className="flex-1 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    Отмена
                  </button>
                  <button
                    onClick={handleRemove}
                    className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Удалить
                  </button>
                </div>
              </div>
            )}

            {modalType === 'addClients' && (
              <div>
                <h3 className="mb-4 font-bold text-center">Добавить клиентов</h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Клиенты</label>
                  <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-2">
                    {clients.map((c) => (
                      <label key={c.id} className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          checked={selectedClients.has(c.id)}
                          onChange={() => toggleClient(c.id)}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">{`${c.firstName} ${c.lastName}`}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 mt-6">
                  <button
                    onClick={closeModal}
                    className="flex-1 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    Отмена
                  </button>
                  <button
                    onClick={handleAddClients}
                    className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Сохранить
                  </button>
                </div>
              </div>
            )}
          </Modal>
        </>
      }
    />
  );
}
