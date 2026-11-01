import { mutationOptions } from "@tanstack/react-query";
import { changePassword, updateAvatar, updateProfile } from "./service";

export const updateProfileMutation = mutationOptions({
  mutationFn: (name: string) => updateProfile(name),

})

export const updateAvatarMutation = mutationOptions({
  mutationFn: ( imageUrl: File | null ) => updateAvatar(imageUrl),
})

export const changePasswordMutation = mutationOptions({
  mutationFn: () => changePassword(),
})