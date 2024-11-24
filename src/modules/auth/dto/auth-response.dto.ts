
export class AuthResponseDto {
  message: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
  token: string;
}
