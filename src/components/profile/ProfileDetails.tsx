'use client';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input'; // <-- tu input reutilizable
import { useAuth } from '@/contexts/authContext';
import { SquarePen, Trash } from 'lucide-react';
import { useState, useEffect } from 'react';

interface EditableUser {
  id: number
  name: string
  lastname: string
  dni: string
  email: string
  gender: string
  profileImage?: string
  phone?: string
}

export default function ProfileDetails() {
  const { user } = useAuth();
  const [genders, setGenders] = useState<string[]>();

  const [editableUser, setEditableUser] = useState<EditableUser>({
    id: 0,
    name: '',
    lastname: '',
    dni: '',
    email: '',
    gender: '',
    profileImage: '',
    phone: '',
    });
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    if (user) {
      setEditableUser({
        id: user.id ?? 0,
        name: user.name ?? '',
        lastname: user.lastname ?? '',
        dni: user.dni ?? '',
        email: user.email ?? '',
        gender: user.gender ?? '',
        profileImage: user.profileImage ?? '',
        phone: user.phone ?? ''
      });
    }
  }, [user]);

  useEffect(() => {
    async function fetchGenders() {
      try {
        const res = await fetch('/api/genders',{
          method:'GET'
        }) // ruta donde esté tu backend
        const data = await res.json()
        console.log('data',data)
        setGenders(data.data) // asumiendo que vienen en data.data
      } catch (error) {
        console.error('Error cargando géneros', error)
      }
    }

    fetchGenders()
  }, [])


  useEffect(() => {
    if (!user) {
      setIsChanged(false);
      return;
    }

    const changed =
      editableUser.email !== (user.email ?? '') ||
      editableUser.gender !== (user.gender ?? '') ||
      editableUser.phone !== (user.phone ?? '');

    setIsChanged(changed);
  }, [editableUser, user]);

  const handleChange = (field: keyof typeof editableUser, value: string) => {
    setEditableUser((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    console.log('Guardar datos en backend:', editableUser);
  };

  const handleEditPhoto = () => console.log('Abrir diálogo para editar foto');
  const handleDeletePhoto = () => console.log('Borrar foto de perfil');

  if (!user ) return <p>Cargando usuario...</p>;

  return (
    <div className="space-y-4 max-w-md">
      {/* Botones para foto */}
      <div className="flex justify-center gap-4">
        <Button
          onClick={handleEditPhoto}
          className="px-1 text-sm flex items-center gap-1"
          variant="outline"
        >
          <SquarePen size={14} />
          Editar foto
        </Button>
        <Button
          onClick={handleDeletePhoto}
          className="px-1 text-sm flex items-center gap-1"
          variant="danger"
        >
          <Trash size={14} />
          Quitar foto
        </Button>
      </div>

      {/* Formulario */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (isChanged) handleSave();
        }}
        className="space-y-4"
      >
        {/* Nombre y Apellido (disabled) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nombre"
            value={editableUser.name}
            onChange={(e) => handleChange('name', e.target.value)}
            disabled
          />
          <Input
            label="Apellido"
            value={editableUser.lastname}
            onChange={(e) => handleChange('lastname', e.target.value)}
            disabled
          />
        </div>

        {/* DNI y Género (DNI disabled) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="DNI"
            value={editableUser.dni}
            onChange={(e) => handleChange('dni', e.target.value)}
            disabled
          />
          <div className="flex flex-col">
            <label className="mb-1 text-dark-4 dark:text-gray-1 font-regular font-inter text-sm">
                Género
            </label>
            <select
                value={editableUser.gender}
                onChange={(e) => handleChange('gender', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 dark:bg-background dark:border-gray-2 dark:text-white"
            >
                <option value="">Seleccionar</option>
                {genders?.map((g: string) => (
                <option key={g} value={g}>
                    {g}
                </option>
                ))}
            </select>
            </div>

        </div>

        <Input
          label="Correo"
          type="email"
          value={editableUser.email}
          onChange={(e) => handleChange('email', e.target.value)}
        />
        <Input
          label="Celular"
          value={editableUser.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
        />

        <button
          type="submit"
          disabled={!isChanged}
          className={`w-full px-4 py-2 rounded-lg , ${
            isChanged ? 
                'bg-transparent border border-gray-400 text-gray-700 dark:border-gray-5 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-2 focus:ring-gray-400 cursor-pointer' 
            : 
                ' cursor-not-allowed text-gray-700 dark:text-gray-3 dark:bg-gray-2 focus:ring-gray-400'
          }`}
        >
          Guardar cambios
        </button>
      </form>
    </div>
  );
}
