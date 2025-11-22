'use client';

import { Upload } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';

import InputText from '@/app/components/input/InputText';
import { useInventoryStore } from '@/app/stores/inventoryStore';
import { cn, formatUpdatedDate } from '@/lib/utils';
import FadeUp from '../styles/animation/FadeUp';

const InventoryForm = () => {
  const route = useRouter();
  const addProduct = useInventoryStore((state) => state.addItem);
  const [imagePreview, setImagePreview] = useState<string>('');

  const {
    control,
    setValue,
    handleSubmit,
    getValues,
    reset,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      id: '',
      code: '',
      name: '',
      stock: 0,
      price: '',
      updatedAt: '',
      image: '',
    },
    mode: 'all',
  });

  const handleUploadImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader?.result as string);
      setValue('image', reader?.result as string, { shouldValidate: true });
    };
    reader.readAsDataURL(file);
  };

  const onSubmitForm = () => {
    const dateNow = formatUpdatedDate();

    const dataForm = {
      ...getValues(),
      id: uuidv4(),
      updatedAt: dateNow
    }

    addProduct(dataForm);
    toast.success('Sukses menambahkan produk');
    reset();
    route.push('/inventory');
  };

  return (
    <div className="h-full flex flex-col p-0 md:p-3 xl:p-6">
      <div className="h-full">
        <form onSubmit={handleSubmit(onSubmitForm)} className="flex flex-col gap-10 h-full items-center">
          {/* Form Input */}
          <div className="space-y-6 w-full xl:max-w-[80%]">
            {/* Input Image Product */}
            <FadeUp delay={0.1}>
              <Controller
                control={control}
                name="image"
                rules={{
                  required: 'Foto produk wajib diupload!',
                }}
                render={() => (
                  <div>
                    <input
                      type="file"
                      hidden
                      id="file-upload"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleUploadImage(file);
                      }}
                    />

                    <label htmlFor="file-upload">
                      <div className="w-full min-h-52 bg-(--primary-color) rounded-lg flex justify-center items-center flex-col gap-2 border-2 border-dashed hover:border-(--text-primary-color)/20 hover:bg-(--primary-color)/40 cursor-pointer border-[#101625] duration-300 group/image-cover">
                        {imagePreview ? (
                          <Image
                            alt="Preview Image"
                            width={50}
                            height={50}
                            src={imagePreview}
                            className="w-full h-52 rounded-lg object-center"
                          />
                        ) : (
                          <div className="w-full h-full flex justify-center items-center flex-col gap-2 px-2.5">
                            <Upload className="text-(--text-primary-color)/20" size={50} />
                            <span className="text-(--text-primary-color)/70 text-[0.875rem] text-center group-hover/image-cover:text-(--text-primary-color)/40 duration-300">
                              Mohon unggah foto produk dengan ukuran max 400kb!
                            </span>
                          </div>
                        )}
                      </div>
                    </label>

                    {errors?.image && <span className="text-xs text-red-600 ml-1">{errors.image.message}</span>}
                  </div>
                )}
              />
            </FadeUp>

            {/* Input Name Product */}
            <FadeUp delay={0.2}>
              <Controller
                control={control}
                name="name"
                rules={{
                  required: {
                    value: true,
                    message: 'Nama produk harus diisi!',
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <InputText
                    className="text-(--text-primary-color)/70 focus-within:text-(--text-primary-color) rounded-2xl border-[#101625] bg-(--primary-color) duration-300 focus-within:shadow-lg"
                    errorMessage={errors?.name?.message}
                    placeholder="Nama barang"
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
            </FadeUp>

            {/* Input Code Product */}
            <FadeUp delay={0.3}>
              <Controller
                control={control}
                name="code"
                rules={{
                  required: {
                    value: true,
                    message: 'Kode barang harus diisi!',
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <InputText
                    className="text-(--text-primary-color)/70 focus-within:text-(--text-primary-color) rounded-2xl border-[#101625] bg-(--primary-color) duration-300 focus-within:shadow-lg"
                    errorMessage={errors?.code?.message}
                    placeholder="Kode Produk"
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
            </FadeUp>

            {/* Input Stock Product */}
            <FadeUp delay={0.4}>
              <Controller
                control={control}
                name="stock"
                rules={{
                  required: {
                    value: true,
                    message: 'Stok barang harus diisi!',
                  },
                  pattern: {
                    value: /^[0-9]+$/,
                    message: 'Masukan angka cth "1-9"!',
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <InputText
                    className="text-(--text-primary-color)/70 focus-within:text-(--text-primary-color) rounded-2xl border-[#101625] bg-(--primary-color) duration-300 focus-within:shadow-lg"
                    errorMessage={errors?.stock?.message}
                    placeholder="Stok"
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
            </FadeUp>

            {/* Input Price Product */}
            <FadeUp delay={0.5}>
              <Controller
                control={control}
                name="price"
                rules={{
                  required: {
                    value: true,
                    message: 'Harga barang harus diisi!',
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <InputText
                    currency
                    className="text-(--text-primary-color)/70 focus-within:text-(--text-primary-color) rounded-2xl border-[#101625] bg-(--primary-color) duration-300 focus-within:shadow-lg"
                    errorMessage={errors?.price?.message}
                    placeholder="Harga barang"
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
            </FadeUp>
          </div>

          {/* Button Submit */}
          <div className="w-full lg:max-w-[80%] flex justify-center">
            <FadeUp className="w-full" delay={0.6}>
              <button
                type="submit"
                className={cn(
                  'duration-300 min-h-[40px] bg-(--orange-color) hover:bg-(--orange-color)/80 w-full rounded-lg text-[0.813rem] font-bold text-(--text-primary-color) cursor-pointer',
                )}
              >
                Simpan
              </button>
            </FadeUp>
          </div>
        </form>
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
};

export default InventoryForm;
