'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SquarePen, Trash } from 'lucide-react';
import { Button } from '@/components/ux/Button';
import { Input } from '@/components/ux/Input';
import { useAuth } from '@/contexts/authContext';
import { deleteUserFile, uploadUserFile } from '@/services/media/mediaService';
import { updateUser } from '@/services/user/userService';
import Spinner from '@/components/ux/Spinner';
import { Toast } from '@/components/ux/Toast';
import { AlertDialog } from '@/components/ux/AlertDialog';
import { ProfileData, profileSchema } from '../schemas/profileSchema';


type ProfileFormValues = z.infer<typeof profileSchema>;

const genders = [
  { label: "Masculino", value: "MALE" },
  { label: "Femenino", value: "FEMALE" },
  { label: "Otro", value: "UNSPECIFIED" },
];

export default function ProfileDetails() {
  const { user, fetchUser, setPrevImage } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);
  
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024;
  const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty, errors, isValid },
    watch
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      lastname: '',
      dni: '',
      email: '',
      birthDate: '',
      phone: '',
      gender: 'UNSPECIFIED',
      removeProfileImage: false
    },
    mode: 'onChange' 
  });

  // Cargar datos del usuario en el formulario
  useEffect(() => {
    if (user) {
      reset({
        name: user.name ?? '',
        lastname: user.lastname ?? '',
        dni: user.dni ?? '',
        email: user.email ?? '',
        birthDate: user.birthDate ?? '',
        phone: user.phone ?? '',
        gender: (user.gender as "MALE" | "FEMALE" | "UNSPECIFIED") ?? 'UNSPECIFIED',
        removeProfileImage: false
      });
    }
  }, [user, reset]);

  // Limpieza de URL de la imagen previa
  useEffect(() => {
    return () => {
      if (selectedFile) URL.revokeObjectURL(selectedFile.name);
    };
  }, [selectedFile]);

  const onSubmit: SubmitHandler<ProfileFormValues> = async (data) => {
    setLoading(true);
    try {
      if (!user) return;

      // Subir imagen si existe
      if (selectedFile) {
        await uploadUserFile(user.id!, selectedFile);
      }

      // Actualizar datos
      const response = await updateUser({
        phone: data.phone,
        gender: data.gender as ProfileData['gender'],
        removeProfileImage: false,
        file: selectedFile ?? undefined,
      });

      if (response.state === 'ERROR') {
        throw new Error(response.messages?.[0] ?? 'Error al guardar el perfil');
      }

      await fetchUser();
      setLoading(false);
      setToast({ message: 'Perfil actualizado correctamente', type: 'success' });
      
      // Reiniciamos el estado "dirty" del form con los nuevos valores
      reset(data); 
      setSelectedFile(null); // Limpiamos el archivo seleccionado
      
      router.push('/profile'); 
    } catch (error: unknown) {
      setLoading(false);
      let message = "Error desconocido";
      if (error instanceof Error) message = error.message;
      setToast({ message, type: 'error' });
    }
  };

  const handleEditPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    if (!ALLOWED_TYPES.includes(file.type)) {
      setToast({ message: 'Formato inválido. Solo se permiten PNG, JPG, JPEG y WEBP.', type: 'error' });
      e.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setToast({ message: 'La imagen supera el tamaño máximo permitido de 2 MB', type: 'error' });
      e.target.value = "";
      return;
    }

    setSelectedFile(file);
    
    const previewUrl = URL.createObjectURL(file);
    setPrevImage(previewUrl);
  };

  const handleDeletePhoto = async () => {
    if (!user) return;
    try {
      await deleteUserFile(user.id!);
      
      // Obtenemos los valores actuales del form para enviarlos y mantener consistencia
      const currentValues = watch(); 

      const response = await updateUser({
        phone: currentValues.phone,
        gender: currentValues.gender as ProfileData['gender'],
        removeProfileImage: true,
      });

      if (response.state === 'ERROR') {
         throw new Error(response.messages?.[0]);
      }

      await fetchUser();
      setPrevImage(null);
      setSelectedFile(null);
      setToast({ message: 'Foto eliminada correctamente', type: 'success' });

    } catch (error: unknown) {
      let message = "Error desconocido";
      if (error instanceof Error) message = error.message;
      setToast({ message, type: 'error' });
    }
  };

  
  // Calculamos si hay cambios reales: Formulario sucio o archivo seleccionado
  const hasChanges = isDirty || !!selectedFile;

  // Controlamos si el button debe estar o no deshabilitado
  const isButtonDisabled = !hasChanges || !isValid || loading;

  if (!user) return <p>Cargando usuario...</p>;

  return (
    <div className="space-y-4 max-w-md">
      {/* Botones para foto */}
      <div className="flex justify-center gap-4">
        <label className="px-4 text-sm flex items-center gap-1 border rounded cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors py-2">
          <SquarePen size={14} />
          Editar foto
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleEditPhoto}
          />
        </label>
        <Button
          onClick={(e) => {
            e.preventDefault(); // Prevenir submit accidental
            handleDeletePhoto();
          }}
          className="text-sm flex items-center gap-1"
          variant="danger"
        >
          <Trash size={14} />
          Quitar foto
        </Button>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        {/* Nombre y Apellido (disabled) */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Nombre"
            disabled
            {...register('name')}
          />
          <Input
            label="Apellido"
            disabled
            {...register('lastname')}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="DNI"
            disabled
            {...register('dni')}
          />
          <Input
            label="Fecha de nacimiento"
            disabled
            {...register('birthDate')}
          />
        </div>

        <Input
          label="Correo"
          type="email"
          disabled
          className="w-full"
          {...register('email')}
        />

        <div className="grid grid-cols-2 gap-4">
          {/* Campo Celular Editable */}
          <div>
            <Input
              label="Celular"
              {...register('phone')}
              error={errors.phone?.message} 
            />
          </div>

          {/* Campo Género Editable */}
          <div className="flex flex-col">
            <label className="mb-1 text-dark-4 dark:text-gray-1 font-regular font-inter text-sm">
              Género
            </label>
            <select
              {...register('gender')}
              className="w-full border border-gray-300 rounded-md px-3 py-2 dark:bg-dark-5 dark:border-gray-2 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="UNSPECIFIED">Seleccionar</option>
              {genders.map(g => (
                <option key={g.value} value={g.value}>{g.label}</option>
              ))}
            </select>
            {errors.gender && (
              <p className=" text-red-500 mt-1">{errors.gender.message}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isButtonDisabled}
          className={`w-full px-4 py-2 rounded-lg transition-all font-medium ${
            !isButtonDisabled
              ? 'bg-transparent border border-gray-400 text-gray-700 dark:border-gray-5 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-2 focus:ring-gray-400 cursor-pointer'
              : 'cursor-not-allowed text-gray-400 bg-gray-200 dark:text-gray-500 dark:bg-dark-4 border border-transparent opacity-70'
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <Spinner size={20} />
              <span>Guardando...</span>
            </div>
          ) : (
            'Guardar cambios'
          )}
        </button>
      </form>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <AlertDialog
        isOpen={isAlertOpen}
        title="Tienes cambios sin guardar"
        description="Si sales de esta página perderás los cambios realizados."
        confirmText="Salir sin guardar"
        cancelText="Cancelar"
        onConfirm={() => {
          reset(); 
          if (pendingNavigation === "back") {
            router.back();
          } else if (pendingNavigation) {
            router.push(pendingNavigation);
          }
          setPendingNavigation(null);
          setIsAlertOpen(false);
        }}
        onClose={() => {
          setPendingNavigation(null);
          setIsAlertOpen(false);
        }}
      />
    </div>
  );
}