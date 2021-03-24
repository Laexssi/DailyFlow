import { firestore, firebase } from 'firebaseDir';

const QUERY_IN_LIMIT = 10;

export async function createUserRequest(payload) {
  const { uid: id, metadata: { creationTime, lastSignInTime } } = payload;
  await firestore.collection('users').doc(id).set({
    displayName: payload.displayName,
    email: payload.email,
    uid: payload.uid,
    photoURL: payload.photoURL,
    lastSignInTime,
    creationTime,
  });
}

export async function fetchUsers() {
  const list = [];
  const res = await firestore.collection('users').get();
  res.forEach((doc) => list.push(doc.data()));
  return list;
}

export async function completeActivityRequest(activity) {
  const activityRef = firestore.collection('activity').doc(activity.id);

  const prevCompleteCount = activity.complete_count;
  const timestamp = Date.now();

  await activityRef.update({
    complete_dates: firebase.firestore.FieldValue.arrayUnion(timestamp),
    complete_count: prevCompleteCount + 1,
  });
  return timestamp;
}

export async function cancelCompleteActivity(activity) {
  const activityRef = firestore.collection('activity').doc(activity.id);
  const timestamp = Date.now();

  await activityRef.update({
    complete_dates: activity.complete_dates.slice(0, -1),
    complete_count: activity.complete_count - 1,
  });
  return timestamp;
}

export async function deleteActivityRequest(id) {
  await firestore.collection('activity').doc(id).delete();
  return id;
}

export async function fetchActivities(uid) {
  const list = [];
  const res = await firestore.collection('activity').where('userId', '==', `${uid}`).get();
  res.forEach((doc) => list.push(doc.data()));
  return list;
}

export async function fetchActivityById(id) {
  const activityRef = await firestore.collection('activity').doc(`${id}`).get();
  return activityRef.data();
}

export async function createActivityRequest(newActivity, uid) {
  const activityRef = firestore.collection('activity');
  const { id: activityId } = await activityRef.add({ ...newActivity, userId: uid, creation_date: Date.now() });
  await firestore.collection('activity').doc(activityId).update({ id: activityId });
  return activityId;
}

export async function editActivityRequest(activity) {
  const {
    name, cooldown, labels, emoji, id,
  } = activity;

  const activityRef = firestore.collection('activity').doc(id);
  await activityRef.update({
    name, cooldown, labels, emoji,
  });
  return id;
}

export async function deleteLabelRequest(id) {
  await firestore.collection('label').doc(id).delete();
  return id;
}

export async function createLabelRequest(newLabel, uid) {
  const labelRef = firestore.collection('label');
  const { id } = await labelRef.add({ ...newLabel, userId: uid });
  await firestore.collection('label').doc(id).update({ id });
  return id;
}

export async function editLabelRequest(label) {
   await firestore.collection('label').doc(label.id).set(label);
   return label;
}

export async function fetchLabels(uid) {
  const list = [];
  const res = await firestore.collection('label').where('userId', '==', `${uid}`).get();
  res.forEach((doc) => list.push(doc.data()));
  return list;
}

export async function fetchPlans(uid) {
  const list = [];
  const res = await firestore.collection('plan').where('userId', '==', `${uid}`).get();
  res.forEach((doc) => list.push(doc.data()));
  return list;
}

export async function fetchPlanById(id) {
  const planRef = await firestore.collection('plan').doc(`${id}`).get();
  return planRef.data();
}

export async function deletePlanRequest(id) {
  await firestore.collection('plan').doc(id).delete();
  return id;
}

export async function fetchActivitiesByIds(ids) {
  const chunks = [];
  for (let i = 0; i <= ids.length; i += QUERY_IN_LIMIT) {
    const chunk = ids.slice(i, i + QUERY_IN_LIMIT);
    chunks.push(chunk);
  }
  const list = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const chunk of chunks) {
    // eslint-disable-next-line no-await-in-loop
    const res = await firestore.collection('activity').where('id', '==', `${chunk}`).get();
    res.forEach((doc) => list.push(doc.data()));
  }
  return list;
}

export async function resetPlanActivitiesCounterRequest(plan) {
  const planRef = firestore.collection('plan').doc(plan.id);
  await planRef.update({
    done_activities: 0,
  });
  return 0;
}

export async function completePlanActivityRequest(plan) {
  const planRef = firestore.collection('plan').doc(plan.id);
  const doneActivitiesCount = plan.done_activities + 1;
  await planRef.update({
    done_activities: doneActivitiesCount,
  });
  return doneActivitiesCount;
}

export async function cancelCompletePlanActivityRequest(plan) {
  const planRef = firestore.collection('plan').doc(plan.id);
  const doneActivitiesCount = plan.done_activities - 1;
  await planRef.update({
    done_activities: doneActivitiesCount,
  });
  return doneActivitiesCount;
}

export async function updatePlanRunningRequest(id, state) {
  const planRef = firestore.collection('plan').doc(id);
  await planRef.update({
    running: state,
  });
  return state;
}

export async function completePlanRequest(plan) {
  const planRef = firestore.collection('plan').doc(plan.id);
  const completeData = {
    timestamp: Date.now(),
    done_activities: plan.done_activities,
    total_activities: plan.activities.length,
  };
  await planRef.update({
    running: false,
    done_activities: 0,
    complete: firebase.firestore.FieldValue.arrayUnion({ ...completeData }),
  });
  return completeData;
}

export async function createPlanRequest(newPlan, uid) {
  const planRef = firestore.collection('plan');
  const { id: planId } = await planRef.add({ ...newPlan, userId: uid, creation_date: Date.now() });
  await firestore.collection('plan').doc(planId).update({ id: planId });
  return planId;
}
