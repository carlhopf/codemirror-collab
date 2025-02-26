import { ChangeSet, StateEffect, Extension, EditorState, Transaction, StateField } from '@codemirror/state';

/**
An update is a set of changes and effects.
*/
interface Update {
    /**
    The changes made by this update.
    */
    changes: ChangeSet;
    /**
    The effects in this update. There'll only ever be effects here
    when you configure your collab extension with a
    [`sharedEffects`](https://codemirror.net/6/docs/ref/#collab.collab^config.sharedEffects) option.
    */
    effects?: readonly StateEffect<any>[];
    /**
    The [ID](https://codemirror.net/6/docs/ref/#collab.collab^config.clientID) of the client who
    created this update.
    */
    clientID: string;
}
declare class LocalUpdate implements Update {
    readonly origin: Transaction;
    readonly changes: ChangeSet;
    readonly effects: readonly StateEffect<any>[];
    readonly clientID: string;
    constructor(origin: Transaction, changes: ChangeSet, effects: readonly StateEffect<any>[], clientID: string);
}
declare class CollabState {
    readonly version: number;
    readonly unconfirmed: readonly LocalUpdate[];
    constructor(version: number, unconfirmed: readonly LocalUpdate[]);
}
declare type CollabConfig = {
    /**
    The starting document version. Defaults to 0.
    */
    startVersion?: number;
    /**
    This client's identifying [ID](https://codemirror.net/6/docs/ref/#collab.getClientID). Will be a
    randomly generated string if not provided.
    */
    clientID?: string;
    /**
    It is possible to share information other than document changes
    through this extension. If you provide this option, your
    function will be called on each transaction, and the effects it
    returns will be sent to the server, much like changes are. Such
    effects are automatically remapped when conflicting remote
    changes come in.
    */
    sharedEffects?: (tr: Transaction) => readonly StateEffect<any>[];
};
/**
Create an instance of the collaborative editing plugin.
*/
declare function collab(config?: CollabConfig): Extension;
/**
Create a transaction that represents a set of new updates received
from the authority. Applying this transaction moves the state
forward to adjust to the authority's view of the document.
*/
declare function receiveUpdates(state: EditorState, updates: readonly Update[]): Transaction;
/**
Returns the set of locally made updates that still have to be sent
to the authority. The returned objects will also have an `origin`
property that points at the transaction that created them. This
may be useful if you want to send along metadata like timestamps.
(But note that the updates may have been mapped in the meantime,
whereas the transaction is just the original transaction that
created them.)
*/
declare function sendableUpdates(state: EditorState): readonly (Update & {
    origin: Transaction;
})[];
/**
Get the version up to which the collab plugin has synced with the
central authority.
*/
declare function getSyncedVersion(state: EditorState): number;
/**
Get this editor's collaborative editing client ID.
*/
declare function getClientID(state: EditorState): string;
declare function getCollabField(): StateField<CollabState>;

export { Update, collab, getClientID, getCollabField, getSyncedVersion, receiveUpdates, sendableUpdates };
