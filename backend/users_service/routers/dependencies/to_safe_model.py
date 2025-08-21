from models.safe_user_model import SafeUserModel
from models.user_model import UserModel

def toSafeModel(user: UserModel) -> SafeUserModel:
	return SafeUserModel(
		id=user.id,
		username=user.username,
		email=user.email,
        account_status=user.account_status
	)
