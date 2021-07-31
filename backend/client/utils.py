import string


def filter_phone(value):
    return ''.join(filter(lambda x: x in string.digits, value or ''))
