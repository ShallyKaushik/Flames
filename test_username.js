import mongoose from 'mongoose';
import { checkUsernameService } from './backend/src/services/auth.service.js';

async function test() {
    console.log(await checkUsernameService('sanyam123'));
}
test();
