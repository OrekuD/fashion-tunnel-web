import { requestActions } from './slices/request.slice';
import { CPA } from './types';

const postRequest = (action: CPA<any>) => {
	action.dispatch(
		requestActions.fulfilled({
			name: action.type,
			message: '',
			payload: {}
		})
	);
};

export default postRequest;
