import crypto from 'crypto';

export default function token() {
    return crypto.randomBytes(32).toString('hex');
}