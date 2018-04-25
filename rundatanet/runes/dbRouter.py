class RunesDatabaseRouter:
    def db_for_read(self, model, **hints):
        if model._meta.app_label == 'runes':
            return 'runes_db'
        return None

    def db_for_write(self, model, **hints):
        if model._meta.app_label == 'runes':
            return 'runes_db'
        return None

    def allow_relation(self, obj1, obj2, **hints):
        # Allow any relation between two models that are both in the Runes app.
        if obj1._meta.app_label == 'runes' and obj2._meta.app_label == 'runes':
            return True
        # No opinion if neither object is in the Runes app (defer to default or other routers).
        elif 'runes' not in [obj1._meta.app_label, obj2._meta.app_label]:
            return None

        # Block relationship if one object is in the Runes app and the other isn't.
        return False

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        """
        Make sure the runes app only appears in the 'runes_db' database.
        """
        if app_label == 'runes':
            # The Runes app should be migrated only on the runes_db database.
            return db == 'runes_db'
        elif db == 'runes_db':
            # Ensure that all other apps don't get migrated on the runes_db database.
            return False

        # No opinion for all other scenarios
        return None