import { blockchainService } from '@/services';

type Role = 'tourist' | 'police' | 'hotel' | 'airport';

interface UserRecord {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  did?: string;
}

const memoryDb: Record<string, UserRecord> = {};

export const authService = {
  async signup({ name, email, password, role }: { name: string; email: string; password: string; role: Role }) {
    if (memoryDb[email]) throw new Error('User already exists');
    const id = `u_${Date.now()}`;
    const did = await blockchainService.createDigitalId(id);
    const user: UserRecord = { id, name, email, password, role, did };
    memoryDb[email] = user;
    return { id, role, did };
  },
  async login(email: string, password: string) {
    const user = memoryDb[email];
    if (!user || user.password !== password) throw new Error('Invalid credentials');
    return { id: user.id, role: user.role, did: user.did };
  },
  async logout() {
    return true;
  },
};


