export type User = {
  _id: string;
  username: string;
  name: string;
  email: string;

  avatar?: {
    url?: string;
    publicId?: string;
  };

  isVerified: boolean;

  lastLoginAt?: Date;
  passwordChangedAt?: Date | undefined;

  createdAt: Date;
  updatedAt: Date;
}

