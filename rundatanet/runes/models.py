from django.db import models

# Create your models here.
class Signature(models.Model):
    signature_text = models.CharField(max_length=200)
    parent = models.ForeignKey('self',
        blank=True,
        null=True,
        related_name='children',
        on_delete=models.CASCADE,
    )
    # meta = models.ForeignKey('MetaInformation',
    #     on_delete = models.CASCADE,
    #     blank = True,
    #     null = True,
    #     related_name = "signature",
    #     )

    def __str__(self):
        return self.signature_text

    class Meta:
        db_table = "signatures"

class CrossForm(models.Model):
    """CrossForm is a building block of crosses. Each cross consists of a list of CrossForms"""
    name = models.CharField(max_length=200)
    group_id = models.PositiveIntegerField(default=0, blank=False, null=False)

    def __str__(self):
        return "{} in group {}".format(self.name, self.group_id)

    class Meta:
        db_table = "cross_forms"

class CrossDefinition(models.Model):
    """CrossDefinition is used to construct a list of CrossForm objects"""
    cross = models.ForeignKey('Cross', blank=False, null=False,
        on_delete=models.CASCADE,
        related_name = "forms")
    form = models.ForeignKey(CrossForm,
        on_delete=models.CASCADE,
        blank=False,
        null=False)
    is_certain = models.BooleanField(default=True)

    class Meta:
        db_table = "cross_definitions"

class Cross(models.Model):
    """Cross defines one particular cross"""
    # Cross contains a link to meta information and accessible from
    # meta information via <meta>.crosses. Each meta can have several crosses.
    # Each cross is a list of CrossDefinition objects.
    meta = models.ForeignKey('MetaInformation',
        on_delete=models.CASCADE,
        blank=False,
        null=False,
        related_name="crosses")

    def __str__(self):
        res = [];
        res.append("{} => ".format(self.id))
        for i, crossDefinition in enumerate(self.forms.all()):
            if i:
                res.append(", ".format(crossDefinition.form.name))
            res.append(crossDefinition.form.name)

        return "".join(res)

    class Meta:
        db_table = "crosses"

class MaterialType(models.Model):
    name = models.TextField(blank=False, unique=True)

    def __str__(self):
        return self.name

    class Meta:
        db_table = "material_types"

class Material(models.Model):
    type = models.ForeignKey(MaterialType,
        on_delete=models.CASCADE)
    name = models.TextField(blank=True, null=False, unique=False)

# default: blank=False, null=False
class MetaInformation(models.Model):
    # Plats
    found_location = models.TextField()
    # Socken
    parish = models.TextField(blank=True)
    # Härad
    district = models.TextField(blank=True)
    # Kommun
    municipality = models.TextField(blank=True)
    # Placering
    current_location = models.TextField(blank=True)
    # Koordinater
    latitude = models.DecimalField(max_digits = 9, decimal_places = 6, default=0)
    longitude = models.DecimalField(max_digits = 9, decimal_places = 6, default=0)
    # Urspr. plats?
    original_site = models.TextField(blank=True)
    # Nuv. koord.
    present_latitude = models.DecimalField(max_digits = 9, decimal_places = 6, default=0)
    present_longitude = models.DecimalField(max_digits = 9, decimal_places = 6, default=0)
    # Sockenkod/Fornlämningsnr.
    parish_code = models.TextField(blank=True)
    # Runtyper
    rune_type = models.TextField(blank=True)

    # Cross is defined externally

    # Period/Datering
    dating = models.TextField(blank=True)
    # Stilgruppering
    style = models.TextField(blank=True)
    # Ristare
    carver = models.TextField(blank=True)
    # Materialtyp
    materialType = models.ForeignKey(MaterialType, on_delete=models.CASCADE, blank=True, null=True)
    # Material
    material = models.TextField(blank=True)

    # Föremål
    objectInfo = models.TextField(blank=True)

    # Övrigt
    additional = models.TextField(blank=True)

    # alternative signature is managed externally

    # Referens
    reference = models.TextField(blank=True)

    # Bildlänk is managed externally

    # not in original Excel:
    lost = models.BooleanField(default=False)
    new_reading = models.BooleanField(default=False)

    class Meta:
        db_table = 'meta_information'

    def __str__(self):
        return "Meta for {}".format(self.signature.signature.signature_text)

class SignatureMetaRelation(models.Model):
    signature = models.OneToOneField(Signature,
        on_delete = models.CASCADE,
        related_name = 'meta'
        )
    meta = models.OneToOneField(MetaInformation,
        on_delete = models.CASCADE,
        related_name = 'signature'
        )

class ImageLink(models.Model):
    meta = models.ForeignKey(MetaInformation, on_delete=models.CASCADE,related_name='images')
    link_url = models.URLField()
    direct_url = models.URLField(blank=True)

class NormalisationNorse(models.Model):
    signature = models.OneToOneField(Signature,
        on_delete=models.CASCADE,
        primary_key=True,
        related_name='normalisation_norse',
    )
    value = models.TextField()

    def __str__(self):
        return '{}: {}'.format(self.signature.signature_text, self.value)

    class Meta:
        db_table = 'normalisation_norse'

class NormalisationScandinavian(models.Model):
    signature = models.OneToOneField(Signature,
        on_delete=models.CASCADE,
        primary_key=True,
        related_name='normalisation_scandinavian',
    )
    value = models.TextField()

    def __str__(self):
        return '{}: {}'.format(self.signature.signature_text, self.value)

    class Meta:
        db_table = 'normalisation_scandinavian'

class TransliteratedText(models.Model):
    signature = models.OneToOneField(Signature,
        on_delete=models.CASCADE,
        primary_key=True,
        related_name='transliteration',
    )
    value = models.TextField()

    def __str__(self):
        if self.signature and self.value:
            return '{}: {}'.format(self.signature.signature_text, self.value)
        else:
            return 'Object is not complete'

    class Meta:
        db_table = 'transliterated_text'


class TranslationEnglish(models.Model):
    signature = models.OneToOneField(Signature,
        on_delete=models.CASCADE,
        primary_key=True,
        related_name="translation_english",
    )
    value = models.TextField()

    def __str__(self):
        return '{}: {}'.format(self.signature.signature_text, self.value)

    class Meta:
        db_table = 'translation_english'

