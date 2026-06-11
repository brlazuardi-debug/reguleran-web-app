import {setGlobalOptions} from "firebase-functions";
import {onDocumentWritten} from "firebase-functions/v2/firestore";
import {onSchedule} from "firebase-functions/v2/scheduler";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

setGlobalOptions({maxInstances: 10});

// Sync song to public collection when song is created/updated
export const syncSongToPublic = onDocumentWritten(
  "songs/{songId}",
  async (event) => {
    const snap = event.data;
    const songId = event.params.songId;

    if (!snap) {
      logger.info(`Song ${songId} deleted, removing from public`);
      const q = await db
        .collection("publicSongs")
        .where("originalSongId", "==", songId)
        .get();
      q.forEach((doc) => doc.ref.delete());
      return;
    }

    const data = snap.after.data();
    if (!data) return;

    if (data.isPublic === true) {
      const existing = await db
        .collection("publicSongs")
        .where("originalSongId", "==", songId)
        .get();

      const publicData = {
        title: data.title || "",
        artist: data.artist || "",
        key: data.key || "",
        bpm: data.bpm || null,
        lyrics: data.lyrics || "",
        audioUrl: data.audioUrl || "",
        audioFileName: data.audioFileName || "",
        isPublic: true,
        originalSongId: songId,
        sharedBy: data.userId || "",
        sharedByName: data.sharedByName || "",
        createdAt: data.createdAt || new Date().toISOString(),
      };

      if (existing.empty) {
        await db.collection("publicSongs").add(publicData);
        logger.info(`Song ${songId} synced to public`);
      } else {
        await existing.docs[0].ref.update(publicData);
        logger.info(`Song ${songId} updated in public`);
      }
    } else {
      const q = await db
        .collection("publicSongs")
        .where("originalSongId", "==", songId)
        .get();
      q.forEach((doc) => doc.ref.delete());
      logger.info(`Song ${songId} removed from public`);
    }
  }
);

// Weekly cleanup: remove inactive sessions older than 30 days
export const cleanupSessions = onSchedule(
  { schedule: "every monday 02:00", timeZone: "Asia/Jakarta" },
  async () => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const snapshot = await db
      .collection("sessions")
      .where("active", "==", false)
      .where("createdAt", "<", thirtyDaysAgo.toISOString())
      .get();

    let deleted = 0;
    const batch = db.batch();
    snapshot.forEach((doc) => {
      batch.delete(doc.ref);
      deleted++;
    });

    if (deleted > 0) {
      await batch.commit();
    }

    logger.info(`Cleanup complete: ${deleted} inactive sessions removed`);
  }
);
