import {
  RESULTS,
  check,
  request,
  type Permission,
  requestMultiple,
} from 'react-native-permissions';

export interface CheckMultipleResponse {
  permission: Permission;
  status: boolean;
}

export const mergeAllPermissionFlags = (
  responses: CheckMultipleResponse[],
): boolean => {
  const flag = responses
    .map(obj => obj.status)
    .reduce((lastValue, currentValue) => lastValue && currentValue, true);
  return flag;
};

const requestHandler = async (permission: Permission): Promise<boolean> => {
  let CheckFlag = false;
  try {
    const result = await request(permission);
    if (result === RESULTS.LIMITED || result === RESULTS.GRANTED) {
      CheckFlag = true;
    }
  } catch (err) {
    console.log('Error in Request :- ', err);
  }
  return CheckFlag;
};

export const requestSinglePermissionHandler = async (
  Permission: Permission,
): Promise<boolean> => {
  let CheckFlag = false;
  await check(Permission)
    .then(async result => {
      switch (result) {
        case RESULTS.UNAVAILABLE:
          CheckFlag = await requestHandler(Permission);
          break;
        case RESULTS.DENIED:
          CheckFlag = await requestHandler(Permission);
          break;
        case RESULTS.LIMITED:
          CheckFlag = true;
          break;
        case RESULTS.GRANTED:
          CheckFlag = true;
          break;
        case RESULTS.BLOCKED:
          CheckFlag = await requestHandler(Permission);
          break;
      }
    })
    .catch(error => {
      __DEV__ && console.log('Error in check Permission :- ', error);
    });
  return CheckFlag;
};

export const requestMultiplePermissionHandler = async (
  Permissions: Permission[],
): Promise<CheckMultipleResponse[]> => {
  let response: CheckMultipleResponse[] = [];
  await requestMultiple(Permissions)
    .then(statuses => {
      const parseArray = Permissions.map(obj => {
        return {
          permission: obj,
          status: statuses[obj] === 'granted' || statuses[obj] === 'limited',
        };
      });
      response = parseArray;
    })
    .catch(error => {
      __DEV__ && console.log('Error in check multiple Permission :- ', error);
    });
  return response;
};
