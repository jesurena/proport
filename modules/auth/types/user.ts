export interface AuthUser {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    account_id: string | number | null;
    role_name: string | null;
    role_id: string | number | null;
    AccountGroup: string | null;
    AccountName: string | null;
    DomainAccount: string | null;
    avatar: string | null;
    isDeveloper: boolean;
}
