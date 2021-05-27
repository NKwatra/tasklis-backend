export const transformDoc = (doc: any) => {
  return {
    ...doc._doc,
    id: doc._doc._id,
  };
};
