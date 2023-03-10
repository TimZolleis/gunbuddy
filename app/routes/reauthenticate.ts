import type { DataFunctionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import {
    commitClientSession,
    destroyClientSession,
    getClientSession,
    requireUser,
} from '~/utils/session/session.server';
import { RiotReauthenticationClient } from '~/utils/auth/RiotReauthenticationClient';
import { updateUser } from '~/utils/session/reauthentication.server';

export const loader = async ({ request }: DataFunctionArgs) => {
    const user = await requireUser(request, false);
    const session = await getClientSession(request);
    try {
        const reauthenticatedUser = await new RiotReauthenticationClient()
            .init(user)
            .then((client) => client.reauthenticate());

        updateUser(reauthenticatedUser).then(() => console.log('User updated'));
        session.set('user', reauthenticatedUser);
        session.set('reauthenticated-at', Date.now());
        return redirect('/', {
            headers: {
                'Set-Cookie': await commitClientSession(session),
            },
        });
    } catch (e) {
        return redirect('/login', {
            headers: {
                'Set-Cookie': await destroyClientSession(session),
            },
        });
    }
};
